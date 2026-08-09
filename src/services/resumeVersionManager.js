export function getResumeVersions() {
    return JSON.parse(
        localStorage.getItem("resume_versions") || "[]"
    );
}

export function saveResumeVersion(resume) {
    const versions = getResumeVersions();

    const version = {
        id: Date.now().toString(),
        name: resume.name || "Untitled Resume",
        createdAt: new Date().toISOString(),
        ...resume,
    };

    versions.unshift(version);

    localStorage.setItem(
        "resume_versions",
        JSON.stringify(versions)
    );
}

export function deleteResumeVersion(id) {
    const versions = getResumeVersions().filter(
        (item) => item.id !== id
    );

    localStorage.setItem(
        "resume_versions",
        JSON.stringify(versions)
    );
}

export function getResumeVersion(id) {
    return getResumeVersions().find(
        (item) => item.id === id
    );
}

export function clearResumeVersions() {
    localStorage.removeItem("resume_versions");
}