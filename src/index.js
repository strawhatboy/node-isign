import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import archive from './archive'
import { NotSignableException } from './exceptions'

export const DEFAULT_APPLE_CERT_PATH = path.join(__dirname, '../apple_credentials', 'applecerts.pem')
export const DEFAULT_CREDENTIAL_FILE_NAMES = {
    certificate: 'certificate.pem',
    key: 'key.pem',
    provisioning_profile: 'isign.mobileprovision'
}
export let DEFAULT_CREDENTIAL_PATHS = {};


// We will default to using credentials in a particular
// directory with well-known names. This is complicated because
// the old way at Sauce Labs (pre-2017) was:
//   ~/isign-credentials/mobdev.cert.pem, etc.
// But the new way that everyone should now use:
//   ~/.isign/certificate.pem, etc.

class ISign {

    constructor() {
        if (fs.existsSync(path.join(process.env.HOME, 'isign-credentials'))) {
            DEFAULT_CREDENTIAL_PATHS = this.get_credential_paths(
                path.join(process.env.HOME, 'isign-credentials'), {
                    certificate: 'mobdev.cert.pem',
                    key: 'mobdev.key.pem',
                    provisioning_profile: 'mobdev1.mobileprovision'
                }
            )
        } else {
            DEFAULT_CREDENTIAL_PATHS = this.get_credential_paths(
                path.join(process.env.HOME, '.isign')
            )
        }
    }

    get_credential_paths(directory, file_names = DEFAULT_CREDENTIAL_FILE_NAMES) {
        /* Given a directory, return dict of paths to standard
            credential files */
        let paths = {}
        file_names.forEach((file_name, key) => {
            paths[key] = path.join(directory, file_name)
        })
        return paths
    }

    resign_with_creds_dir(input_path,
        credentials_directory,
        kwargs) {
        // Do isign.resign(), but with credential files from this directory
        kwargs.update(this.get_credential_paths(credentials_directory))
        return this.resign(input_path, kwargs)
    }

    resign(input_path,
        apple_cert = DEFAULT_APPLE_CERT_PATH,
        certificate = DEFAULT_CREDENTIAL_PATHS['certificate'],
        key = DEFAULT_CREDENTIAL_PATHS['key'],
        provisioning_profile = DEFAULT_CREDENTIAL_PATHS['provisioning_profile'],
        output_path = path.join(process.cwd(), "out"),
        info_props = null) {


        /* Mirrors archive.resign(), put here for convenience, to unify exceptions,
            and to omit default args */
        try {
            return archive.resign(input_path,
                certificate,
                key,
                apple_cert,
                provisioning_profile,
                output_path,
                info_props)
        }
        catch (e) {
            // re-raise the exception without exposing internal
            // details of how it happened
            throw new NotSignableException(e)
        }
    }

    view(input_path) {
        // Obtain information about the app
        try {
            return archive.view(input_path)
        }
        catch (e) {
            throw new NotSignableException(e)
        }
    }
}

export let isign = new ISign()