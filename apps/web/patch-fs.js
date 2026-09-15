// Patch Node.js fs.readlink on FAT32 filesystems on Windows
// On Windows FAT32, fs.readlink on a regular file throws EISDIR instead of EINVAL.
// Webpack / enhanced-resolve expects EINVAL when checking if a path is a symlink.
const fs = require('fs');

function patchFs() {
  const origReadlink = fs.readlink;
  const origReadlinkSync = fs.readlinkSync;

  fs.readlink = function (path, options, callback) {
    const cb = typeof options === 'function' ? options : callback;
    const opt = typeof options === 'function' ? undefined : options;
    return origReadlink.call(fs, path, opt, (err, linkString) => {
      if (err && err.code === 'EISDIR') {
        const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        newErr.code = 'EINVAL';
        newErr.errno = -4071;
        newErr.syscall = 'readlink';
        newErr.path = path;
        return cb(newErr);
      }
      return cb(err, linkString);
    });
  };

  fs.readlinkSync = function (path, options) {
    try {
      return origReadlinkSync.call(fs, path, options);
    } catch (err) {
      if (err && err.code === 'EISDIR') {
        const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        newErr.code = 'EINVAL';
        newErr.errno = -4071;
        newErr.syscall = 'readlink';
        newErr.path = path;
        throw newErr;
      }
      throw err;
    }
  };

  if (fs.promises && fs.promises.readlink) {
    const origPromisesReadlink = fs.promises.readlink;
    fs.promises.readlink = async function (path, options) {
      try {
        return await origPromisesReadlink.call(fs.promises, path, options);
      } catch (err) {
        if (err && err.code === 'EISDIR') {
          const newErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
          newErr.code = 'EINVAL';
          newErr.errno = -4071;
          newErr.syscall = 'readlink';
          newErr.path = path;
          throw newErr;
        }
        throw err;
      }
    };
  }
}

patchFs();
