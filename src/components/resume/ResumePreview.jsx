import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";

function ResumePreview({ resume, resumeRef, template }) {
    switch (template) {
        case "classic":
            return (
                <ClassicTemplate
                    resume={resume}
                    resumeRef={resumeRef}
                />
            );

        case "minimal":
            return (
                <MinimalTemplate
                    resume={resume}
                    resumeRef={resumeRef}
                />
            );

        default:
            return (
                <ModernTemplate
                    resume={resume}
                    resumeRef={resumeRef}
                />
            );
    }
}

export default ResumePreview;