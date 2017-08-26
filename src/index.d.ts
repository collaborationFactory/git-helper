// Type definitions for git-helper
// Project: Git Helper
// Definitions by: Michael Rose <http://github.com/collaborationFactory>

/**
 * Enable verbose mode which will log detailed information to stdout.
 */
export function enableVerboseMode(): void;

/**
 * Represents the result of a `git log` execution
 */
export interface IGitLogSummary {
    all: IGitLogEntry[];
    latest: IGitLogEntry;
    total: number;
}

/**
 * Represents a single `git log` entry
 */
export interface IGitLogEntry {
    author_email: string;
    author_name: string;
    date: string;
    hash: string;
    message: string;
}

/**
 * Status of the whole Git repository
 */
export interface IGitStatus {
    ahead: number;
    behind: number;
    conflicted: string[];
    created: string[];
    current: string;
    deleted: string[];
    files: IGitFileStatus[];
    modified: string[];
    not_added: string[];
    renamed: string[];
    tracking: string;
}

/**
 * Status of a single file
 */
export interface IGitFileStatus {
    path: string;
    index: string;
    working_dir: string;
}

/**
 * Wrapper around a simple-git repository with additional helper functions.
 */
export class Repository {

    /**
     * Clones a repository from the given remoteUrl checking out the specified branch at the same time.
     * @param {string} toPath Path where to clone repository
     * @param {string} remoteUrl Remote URL of the repository
     * @param {string} branch Branch to immediately check out
     * @return {Promise<Repository>} Resolved when cloned and branch checked out, rejected on error
     */
    public static clone(toPath: string, remoteUrl: string, branch: string): Promise<Repository>;

    /**
     * Name of the repository
     */
    public readonly repoName: string;

    /**
     * Create a new repository for the given path. Default path is the current directory
     *
     * @param {string} repoPath Path to repository (default: ./)
     */
    constructor(repoPath?: string);

    /**
     * Execute `git log [fromHash..toHash]`
     * @param {string} fromHash Commit hash to start log from
     * @param {string} toHash Commit hash until which to receive log
     * @return {Promise<IGitLogSummary>} Resolved with the log details, rejected on error
     */
    public log(fromHash?: string, toHash?: string): Promise<IGitLogSummary>;

    /**
     * Execute `git log -n <size>`
     * @param {number} size Number of commits
     * @return {Promise<IGitLogSummary>} Resolved with the log details, rejected on error
     */
    public logLast(size: number): Promise<IGitLogSummary>;

    /**
     * Checks whether the given commit exists
     * @param {string} hash Commit hash to check
     * @return {Promise<string>} Resolved with commit hash if exists, rejected on error or if doesn't exist
     */
    public commitExists(hash: string): Promise<string>;

    /**
     * Execute `git fetch`
     * @return {Promise<void>} Resolved after successful fetch, rejected on error
     */
    public fetch(): Promise<void>;

    /**
     * Execute `git status`
     * @return {Promise<IGitStatus>} Resolved with current repository status, rejected on error
     */
    public status(): Promise<IGitStatus>;

    /**
     * Execute `git checkout <branch>`
     * @param {string} branch Branch name to checkout
     * @return {Promise<void>} Resolved after successful checkout, rejected on error
     */
    public checkoutBranch(branch: string): Promise<void>;

    /**
     * Execute `git checkout <commit>` - does nothing if no commit is given.
     * @param {string} commit Commit hash to checkout
     * @return {Promise<void>} Resolved after successful checkout, rejected on error
     */
    public checkoutCommit(commit?: string): Promise<void>;

    /**
     * Execute `git pull <remote>/<branch> --ff-only` where `remote` and `branch` will be
     * determined from {@link status}.
     * @return {Promise<void>} Resolved after successful pull, rejected on error
     */
    public pullOnlyFastForward(): Promise<void>;

    /**
     * Execute `git reset --hard`
     * @return {Promise<void>} Resolved after successful reset, rejected on error
     */
    public resetHard(): Promise<void>;

    /**
     * Shortcut function to get the commit hash of the currently checked out commit
     * @return {Promise<string>} Resolved with current commit hash, rejected on error
     */
    public getCurrentCommitHash(): Promise<string>;
}
