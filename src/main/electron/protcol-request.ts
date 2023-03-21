import {
  ProtocolRequest,
  UploadData,
  UploadFile,
  UploadRawData,
} from 'electron';

export type ElectronUploadData = UploadData | UploadFile | UploadRawData;

/**
 * Determines if the provided object matches the `UploadData` interface.
 *
 * @param uploadData The object to check.
 * @returns `true` if the object matches the `UploadData` interface, `false` otherwise.
 */
function isUploadData(
  uploadData: ElectronUploadData,
): uploadData is UploadData {
  return (
    typeof uploadData === 'object' &&
    'bytes' in uploadData &&
    uploadData.bytes instanceof Buffer &&
    // `UploadData` does not have the `type` property but RawData does,
    // this is the only differentiating property between these two types.
    !('type' in uploadData)
  );
}

/**
 * Determines if the provided object matches the `UploadFile` interface.
 *
 * @param uploadFile The object to check.
 * @returns `true` if the object matches the `UploadFile` interface, `false` otherwise.
 */
function isUploadFile(
  uploadFile: ElectronUploadData,
): uploadFile is UploadFile {
  return (
    typeof uploadFile === 'object' &&
    'filePath' in uploadFile &&
    typeof uploadFile.filePath === 'string' &&
    'length' in uploadFile &&
    typeof uploadFile.length === 'number' &&
    'modificationTime' in uploadFile &&
    typeof uploadFile.modificationTime === 'number' &&
    'offset' in uploadFile &&
    typeof uploadFile.offset === 'number' &&
    'type' in uploadFile &&
    typeof uploadFile.type === 'string' &&
    uploadFile.type === 'file'
  );
}

/**
 * Determines if the provided object matches the `UploadRawData` interface.
 *
 * @param uploadRawData The object to check.
 * @returns `true` if the provided object matches the `UploadRawData` interface, `false` otherwise.
 */
function isUploadRawData(
  uploadRawData: ElectronUploadData,
): uploadRawData is UploadRawData {
  return (
    typeof uploadRawData === 'object' &&
    'bytes' in uploadRawData &&
    uploadRawData.bytes instanceof Buffer &&
    'type' in uploadRawData &&
    typeof uploadRawData.type === 'string' &&
    uploadRawData.type === 'rawData'
  );
}

/**
 * Extracts the body from the provided `ProtocolRequest` object as a `Buffer`.
 *
 * @param request The `ProtocolRequest` object to extract the body from.
 * @returns The extracted body as a `Buffer` if it exists, `null` otherwise.
 */
export function getRequestBody(request: ProtocolRequest): Buffer | null {
  // [TODO] - in what scenarios is there more than one element in this array?
  const uploadData = request.uploadData?.[0] ?? null;

  if (!uploadData) {
    return null;
  }

  if (isUploadRawData(uploadData) || isUploadData(uploadData)) {
    return uploadData.bytes;
  } else if (isUploadFile(uploadData)) {
    // [TODO] - handle file uploading
    throw new Error('File uploading is not yet supported');
  } else {
    throw new Error('Unrecognized UploadData type');
  }
}
