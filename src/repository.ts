/**
 * Repository class providing helper methods
 */
import * as path from 'path';
import * as simpleGit from 'simple-git';
import {Global} from './global';
import {IGitLogSummary, IGitStatus} from './models';

export class Repository {

    public static clone(toPath: string, remoteUrl: string, branch: string): Promise<Repository> {
        return new Promise<Repository>((resolve, reject) => {
            Global.isVerbose() && console.log('cloning branch', branch, 'from', remoteUrl, 'to', toPath);
            simpleGit().clone(remoteUrl, toPath, ['--branch', branch], (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Repository(toPath));
                }
            });
        });
    }

    public readonly repoName: string;
    private readonly git: simpleGit.Git;

    constructor(repoPath: string = './') {
        this.git = simpleGit(repoPath);
        this.repoName = path.basename(path.resolve(repoPath));
    }

    public log(fromHash?: string, toHash?: string): Promise<IGitLogSummary> {
        return new Promise<IGitLogSummary>((resolve, reject) => {
            this.git.log(
                {
                    format: {
                        author_email: '%ae',
                        author_name: '%aN',
                        date: '%ai',
                        hash: '%H',
                        message: '%B',
                    },
                    from: fromHash,
                    splitter: '__fieldSplitter_1234eirhgnsergfse324__',
                    to: toHash,
                },
                (err: any, data: IGitLogSummary) => {
                    err ? reject(err) : resolve(data);
                },
            );
        });
    }

    public logLast(size: number): Promise<IGitLogSummary> {
        return new Promise<IGitLogSummary>((resolve, reject) => {
            this.git.log(['-n', size + ''], (err: any, data: IGitLogSummary) => {
                err ? reject(err) : resolve(data);
            });
        });
    }

    public commitExists(hash: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            Global.isVerbose() && console.log('Checking commit existence for', hash);
            this.git.revparse(['-q', '--verify', `${hash}^{commit}`], (err: any, data: string) => {
                err || !data ? reject(err) : resolve(data.trim());
            });
        });
    }

    public fetch(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.git.fetch((err) => {
                if (err) {
                    reject(err);
                } else {
                    Global.isVerbose() && console.log(`repo ${this.repoName} successfully fetched`);
                    resolve();
                }
            });
        });
    }

    public status(): Promise<IGitStatus> {
        return new Promise<IGitStatus>((resolve, reject) => {
            this.git.status((err: any, status: IGitStatus) => {
                if (err) {
                    reject(err);
                } else {
                    Global.isVerbose() && console.log('result of gitStatus', status);
                    resolve(status);
                }
            });
        });
    }

    public checkoutBranch(branch: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Global.isVerbose() && console.log(`checkout ${this.repoName}, in branch `, branch);
            this.git.checkout(branch, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    Global.isVerbose() && console.log(`repo ${this.repoName} is now in branch`, branch);
                    resolve();
                }
            });
        });
    }

    public checkoutCommit(commit: string): Promise<void> {
        if (commit) {
            return new Promise<void>((resolve, reject) => {
                this.git.checkout(commit, (err: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        Global.isVerbose() && console.log(`repo ${this.repoName} is now in commit`, commit);
                        resolve();
                    }
                });
            });
        } else {
            Global.isVerbose() && console.log('no commit given');
            return Promise.resolve();
        }
    }

    public pullOnlyFastForward(): Promise<void> {
        return this.status()
            .then(({tracking}) => {
                const i = tracking.indexOf('/');
                if (i < 0) {
                    return Promise.reject(`cannot determine remote and branch for ${tracking}`);
                }

                const remote = tracking.substring(0, i);
                const branch = tracking.substr(i + 1);

                Global.isVerbose() && console.log(`pulling branch ${branch} from remote ${remote}`);
                return new Promise<void>((resolve, reject) => {
                    this.git.pull(remote, branch, {'--ff-only': true}, (err: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });
    }

    public resetHard(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.git.reset('hard', (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    Global.isVerbose() && console.log(`repo ${this.repoName} has been reset`);
                    resolve();
                }
            });
        });
    }

    public getCurrentCommitHash(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.git.revparse(['HEAD'], (err: any, commit: string) => {
                if (err) {
                    reject(err);
                } else {
                    commit = commit.trim();
                    Global.isVerbose() && console.log('current HEAD commit', commit);
                    resolve(commit);
                }
            });
        });
    }

}
