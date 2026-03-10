import { useState, useEffect, type ChangeEvent } from "react";
import Markdown from "react-markdown";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "./CoverLetterTemplater.css";

const STORAGE_KEY = "cover-letter-fields";

interface CoverLetterFields {
  name: string;
  cvLink: string;
  linkedinLink: string;
  githubLink: string;
  title: string;
  company: string;
  whoAmI: string;
  aboutIt: string;
  whyMatch: string;
  contactMe: string;
}

const initialFields: CoverLetterFields = {
  name: "",
  cvLink: "",
  linkedinLink: "",
  githubLink: "",
  title: "",
  company: "",
  whoAmI: "",
  aboutIt: "",
  whyMatch: "",
  contactMe: "",
};

function IconCV() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

interface PreviewIdentityProps {
  name: string;
  title: string;
  company: string;
  cvLink: string;
  linkedinLink: string;
  githubLink: string;
}

function PreviewIdentity({ name, title, company, cvLink, linkedinLink, githubLink }: PreviewIdentityProps) {
  return (
    <div className="preview-identity">
      <div>
        <h1>{name || <em style={{ opacity: 0.4 }}>Name</em>}</h1>
        <h2>
          {title || <em style={{ opacity: 0.4 }}>Title</em>}
          {" | "}
          {company || <em style={{ opacity: 0.4 }}>Company</em>}
        </h2>
      </div>

      {(cvLink || linkedinLink || githubLink) && (
        <div className="preview-links">
          {cvLink && (
            <a href={cvLink} target="_blank" rel="noreferrer">
              <IconCV /> CV
            </a>
          )}
          {linkedinLink && (
            <a href={linkedinLink} target="_blank" rel="noreferrer">
              <IconLinkedIn /> LinkedIn
            </a>
          )}
          {githubLink && (
            <a href={githubLink} target="_blank" rel="noreferrer">
              <IconGitHub /> GitHub
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function PreviewText({ value }: { value: string }) {
  if (!value) return <em style={{ opacity: 0.4 }}>—</em>;
  return <Markdown>{value}</Markdown>;
}

function loadFromStorage(): CoverLetterFields {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...initialFields, ...JSON.parse(stored) };
  } catch {
    // ignore parse errors
  }
  return initialFields;
}

export function CoverLetterTemplater() {
  const [fields, setFields] = useState<CoverLetterFields>(loadFromStorage);
  const [isEditing, setIsEditing] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isEditing && fields.company) {
      const slug = fields.company.toLowerCase().replace(/\s+/g, "-");
      document.title = `cover-letter-${slug}`;
    } else {
      document.title = "Cover Letter Generator";
    }
  }, [isEditing, fields.company]);

  const handleChange =
    (key: keyof CoverLetterFields) =>
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      setSaved(false);
    };

  const handleMdChange =
    (key: keyof CoverLetterFields) => (value: string | undefined) => {
      setFields((prev) => ({ ...prev, [key]: value ?? "" }));
      setSaved(false);
    };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    setSaved(true);
  };

  return (
    <div className="cover-letter">
      <div className="cover-letter-header">
        {isEditing && <h1>Cover Letter Generator</h1>}
        <button onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? "Preview" : "Edit"}
        </button>
        <button onClick={handleSave}>Save</button>
        {saved && <span>Saved</span>}
        {!isEditing && <button onClick={() => window.print()}>Print</button>}
      </div>

      {isEditing ? (
        <div className="cover-letter-fields">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={fields.name}
              onChange={handleChange("name")}
              placeholder="Jane Doe"
            />
          </div>

          <div className="field">
            <label htmlFor="cvLink">CV Link</label>
            <input
              id="cvLink"
              type="url"
              value={fields.cvLink}
              onChange={handleChange("cvLink")}
              placeholder="https://example.com/cv.pdf"
            />
          </div>

          <div className="field">
            <label htmlFor="linkedinLink">LinkedIn</label>
            <input
              id="linkedinLink"
              type="url"
              value={fields.linkedinLink}
              onChange={handleChange("linkedinLink")}
              placeholder="https://linkedin.com/in/you"
            />
          </div>

          <div className="field">
            <label htmlFor="githubLink">GitHub</label>
            <input
              id="githubLink"
              type="url"
              value={fields.githubLink}
              onChange={handleChange("githubLink")}
              placeholder="https://github.com/you"
            />
          </div>

          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={fields.title}
              onChange={handleChange("title")}
              placeholder="Senior Software Engineer"
            />
          </div>

          <div className="field">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={fields.company}
              onChange={handleChange("company")}
              placeholder="Acme Corp"
            />
          </div>

          <div className="field field--big">
            <label>Who am I and what am I looking for</label>
            <MDEditor
              value={fields.whoAmI}
              onChange={handleMdChange("whoAmI")}
              preview="edit"
              hideToolbar={false}
              textareaProps={{ spellCheck: true }}
            />
          </div>

          <div className="field field--big">
            <label>About it in short</label>
            <MDEditor
              value={fields.aboutIt}
              onChange={handleMdChange("aboutIt")}
              preview="edit"
              hideToolbar={false}
              textareaProps={{ spellCheck: true }}
            />
          </div>

          <div className="field field--big">
            <label>Why it can be a match with your company</label>
            <MDEditor
              value={fields.whyMatch}
              onChange={handleMdChange("whyMatch")}
              preview="edit"
              hideToolbar={false}
              textareaProps={{ spellCheck: true }}
            />
          </div>

          <div className="field field--big">
            <label>Contact me here</label>
            <MDEditor
              value={fields.contactMe}
              onChange={handleMdChange("contactMe")}
              preview="edit"
              hideToolbar={false}
              textareaProps={{ spellCheck: true }}
            />
          </div>
        </div>
      ) : (
        <div className="cover-letter-preview">
          <PreviewIdentity
            name={fields.name}
            title={fields.title}
            company={fields.company}
            cvLink={fields.cvLink}
            linkedinLink={fields.linkedinLink}
            githubLink={fields.githubLink}
          />

          <div className="preview-section">
            <PreviewText value={fields.whoAmI} />
          </div>
          <div className="preview-section">
            <PreviewText value={fields.aboutIt} />
          </div>
          <div className="preview-section">
            <PreviewText value={fields.whyMatch} />
          </div>
          <div className="preview-section">
            <PreviewText value={fields.contactMe} />
          </div>
        </div>
      )}
    </div>
  );
}
