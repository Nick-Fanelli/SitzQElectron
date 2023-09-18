import packageJSON from '../package.json'

export namespace BuildSpecs {

    export const BUILD_VERSION = packageJSON.version;
    export const IS_DEV = process.env.NODE_ENV === 'development';

}