

export class NotSignableException extends Error {
    // superclass for any reason why app shouldn't be signable
}

export class NotMatchedException extends Error {
    // thrown if we can't find any app class for this file path
}

export class MissingHelpersException extends NotSignableException {
    // thrown if helper apps are missing
}

export class MissingCredentialsException extends Error {
    // thrown if credentials are missing
}

export class ImproperCredentialsException extends Error {
    // thrown if something looks fishy about credentials
}

export class OpenSslFailureException extends Error {
    // something is wrong with openssl output
}