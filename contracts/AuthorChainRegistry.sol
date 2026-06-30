// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title AuthorChainRegistry
/// @notice Minimal on-chain proof-of-authorship registry for AuthorChain books.
///         Stores only a content hash, the author's wallet, a metadata hash, a
///         royalty rate, and a timestamp — never book content or private URLs.
/// @dev    MVP uses a trusted server signer: the app's backend submits the tx and
///         passes `author` explicitly. A later phase can switch to author-signed
///         transactions (msg.sender == author).
contract AuthorChainRegistry {
    uint16 public constant MAX_ROYALTY_BPS = 10000; // 100.00%

    struct Registration {
        address author;
        bytes32 bookHash;
        string metadataHash;
        uint16 royaltyBps;
        uint256 timestamp;
    }

    /// @dev bookHash => registration. A non-zero timestamp means "registered".
    mapping(bytes32 => Registration) private _byBookHash;

    event BookRegistered(
        bytes32 indexed registrationId,
        address indexed author,
        bytes32 indexed bookHash,
        string metadataHash,
        uint16 royaltyBps,
        uint256 timestamp
    );

    /// @notice Register proof of authorship for a book hash.
    /// @param bookHash      Deterministic hash of the book (off-chain content/identity).
    /// @param author        Wallet credited as the author/owner.
    /// @param metadataHash  Hash or URI of public metadata (kept off-chain).
    /// @param royaltyBps    Royalty rate in basis points (0..10000).
    /// @return registrationId Deterministic id for this (bookHash, author) pair.
    function register(
        bytes32 bookHash,
        address author,
        string calldata metadataHash,
        uint16 royaltyBps
    ) external returns (bytes32 registrationId) {
        require(bookHash != bytes32(0), "bookHash required");
        require(author != address(0), "author required");
        require(royaltyBps <= MAX_ROYALTY_BPS, "royaltyBps too high");
        require(_byBookHash[bookHash].timestamp == 0, "already registered");

        registrationId = keccak256(abi.encode(bookHash, author));

        _byBookHash[bookHash] = Registration({
            author: author,
            bookHash: bookHash,
            metadataHash: metadataHash,
            royaltyBps: royaltyBps,
            timestamp: block.timestamp
        });

        emit BookRegistered(
            registrationId,
            author,
            bookHash,
            metadataHash,
            royaltyBps,
            block.timestamp
        );
    }

    /// @notice Whether a book hash has already been registered.
    function isRegistered(bytes32 bookHash) public view returns (bool) {
        return _byBookHash[bookHash].timestamp != 0;
    }

    /// @notice Full registration details for a book hash.
    /// @dev Reverts if not registered, so callers should guard with isRegistered.
    function getRegistration(bytes32 bookHash)
        external
        view
        returns (Registration memory)
    {
        require(_byBookHash[bookHash].timestamp != 0, "not registered");
        return _byBookHash[bookHash];
    }
}
