/**
 * Data types for Git interaction
 */

export interface IGitLogSummary {
    all: IGitLogEntry[];
    latest: IGitLogEntry;
    total: number;
}

export interface IGitLogEntry {
    author_email: string;
    author_name: string;
    date: string;
    hash: string;
    message: string;
}

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

export interface IGitFileStatus {
    path: string;
    index: string;
    working_dir: string;
}
