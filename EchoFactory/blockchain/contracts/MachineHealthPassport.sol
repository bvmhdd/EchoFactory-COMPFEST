// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MachineHealthPassport
 * @dev Smart Contract untuk mencatat riwayat audit & kesehatan mesin industri (EchoFactory)
 *      serta eksekusi klaim garansi parametrik secara permanen di jaringan Polygon Amoy.
 */
contract MachineHealthPassport {
    
    struct MachineProfile {
        string machineId;
        string modelType;
        uint256 ratedRPM;
        bytes32 baselineHash;
        uint256 registeredAt;
        address registeredBy;
    }

    struct InspectionRecord {
        uint256 timestamp;
        uint256 anomalyScore; // Skala 1:1000 (contoh: score 0.045 disimpan sebagai 45, 0.850 sebagai 850)
        string status;        // "NORMAL", "WARNING", "CRITICAL"
        string defectType;    // "None (Healthy)", "Bearing Inner Race Defect", "Pump Cavitation", dll.
        string ipfsMetadata;  // CID IPFS atau hash metadata rekaman audio
        bytes32 dataHash;     // SHA-256 hash dari data komplit untuk pembuktian kriptografi
        address inspector;    // Address pengirim / node inspeksi
    }

    struct WarrantyClaim {
        uint256 claimId;
        string machineId;
        uint256 filedAt;
        string defectDescription;
        bool isApproved;
        string resolutionNote;
    }

    // Registrasi profil mesin (UC-03)
    mapping(string => MachineProfile) public machineProfiles;

    // Mapping dari Machine ID ke array riwayat inspeksi (UC-01 & UC-07)
    mapping(string => InspectionRecord[]) private machineRegistry;

    // Mapping untuk klaim garansi parametrik (UC-08)
    mapping(uint256 => WarrantyClaim) public warrantyClaims;
    uint256 public totalClaimsCount;

    // Events
    event MachineRegistered(string indexed machineId, bytes32 baselineHash, address indexed owner);
    
    event InspectionLogged(
        string indexed machineId,
        uint256 indexed timestamp,
        uint256 anomalyScore,
        string status,
        string defectType,
        bytes32 dataHash,
        address indexed inspector
    );

    event WarrantyClaimFiled(
        uint256 indexed claimId,
        string indexed machineId,
        bool isApproved,
        string note
    );

    /**
     * @notice UC-03: Mendaftarkan profil mesin baru & mengunci centroid baseline hash (Genesis Profile)
     */
    function registerMachine(
        string memory _machineId,
        string memory _modelType,
        uint256 _ratedRPM,
        bytes32 _baselineHash
    ) external {
        require(bytes(_machineId).length > 0, "Machine ID tidak boleh kosong");
        require(machineProfiles[_machineId].registeredAt == 0, "Mesin sudah terdaftar");

        machineProfiles[_machineId] = MachineProfile({
            machineId: _machineId,
            modelType: _modelType,
            ratedRPM: _ratedRPM,
            baselineHash: _baselineHash,
            registeredAt: block.timestamp,
            registeredBy: msg.sender
        });

        emit MachineRegistered(_machineId, _baselineHash, msg.sender);
    }

    /**
     * @notice UC-01: Mencatat hasil inspeksi AI/ML baru ke blockchain
     */
    function recordInspection(
        string memory _machineId,
        uint256 _anomalyScore,
        string memory _status,
        string memory _defectType,
        string memory _ipfsMetadata,
        bytes32 _dataHash
    ) external returns (uint256) {
        require(bytes(_machineId).length > 0, "Machine ID tidak boleh kosong");

        InspectionRecord memory newRecord = InspectionRecord({
            timestamp: block.timestamp,
            anomalyScore: _anomalyScore,
            status: _status,
            defectType: _defectType,
            ipfsMetadata: _ipfsMetadata,
            dataHash: _dataHash,
            inspector: msg.sender
        });

        machineRegistry[_machineId].push(newRecord);
        uint256 total = machineRegistry[_machineId].length;

        emit InspectionLogged(
            _machineId,
            block.timestamp,
            _anomalyScore,
            _status,
            _defectType,
            _dataHash,
            msg.sender
        );

        return total;
    }

    /**
     * @notice UC-08: Eksekusi klaim garansi parametrik cerdas berbasis histori audit kepatuhan
     */
    function fileWarrantyClaim(
        string memory _machineId,
        string memory _defectDescription
    ) external returns (uint256, bool) {
        uint256 inspectionCount = machineRegistry[_machineId].length;
        // Kriteria parametrik konsensus: Riwayat inspeksi rutin tercatat minimal 5x
        bool autoApproved = inspectionCount >= 5; 

        totalClaimsCount++;
        string memory note = autoApproved 
            ? "Auto-Approved: Standar kepatuhan inspeksi rutin terpenuhi on-chain"
            : "Pending Review: Riwayat kepatuhan inspeksi harian kurang memadai";

        warrantyClaims[totalClaimsCount] = WarrantyClaim({
            claimId: totalClaimsCount,
            machineId: _machineId,
            filedAt: block.timestamp,
            defectDescription: _defectDescription,
            isApproved: autoApproved,
            resolutionNote: note
        });

        emit WarrantyClaimFiled(totalClaimsCount, _machineId, autoApproved, note);
        return (totalClaimsCount, autoApproved);
    }

    /**
     * @notice UC-07: Mengambil seluruh riwayat inspeksi mesin tertentu
     */
    function getMachineHistory(string memory _machineId) external view returns (InspectionRecord[] memory) {
        return machineRegistry[_machineId];
    }

    /**
     * @notice Mengambil status inspeksi paling mutakhir dari suatu mesin
     */
    function getLatestRecord(string memory _machineId) external view returns (InspectionRecord memory) {
        uint256 count = machineRegistry[_machineId].length;
        require(count > 0, "Belum ada riwayat inspeksi untuk mesin ini");
        return machineRegistry[_machineId][count - 1];
    }

    /**
     * @notice Mengambil total inspeksi yang pernah dilakukan pada suatu mesin
     */
    function getTotalInspections(string memory _machineId) external view returns (uint256) {
        return machineRegistry[_machineId].length;
    }

    /**
     * @notice Memvalidasi keaslian hash data inspeksi secara on-chain (Zero-tampering check)
     */
    function verifyDataIntegrity(
        string memory _machineId,
        uint256 _index,
        bytes32 _expectedHash
    ) external view returns (bool) {
        require(_index < machineRegistry[_machineId].length, "Index record di luar batas");
        return machineRegistry[_machineId][_index].dataHash == _expectedHash;
    }
}
