import pem from 'pem'

import { ImproperCredentialsException, 
    MissingCredentialsException,
    OpenSslFailureException } from './exceptions'

import { logFactory } from './logger'

const logger = logFactory.getLogger(require('path').basename(__filename))