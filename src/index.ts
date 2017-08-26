/**
 * git-helper module entry
 */

import {Global} from './global';


export {Repository} from './repository';

/**
 * Enable verbose mode which will log detailed information to stdout.
 */
export function enableVerboseMode(): void {
    Global.enableVerboseMode();
}
