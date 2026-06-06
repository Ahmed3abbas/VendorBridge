import { useRef, useState } from 'react';

export default function FileUpload({ onChange, accept, multiple = true, label = 'Attach files' }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  function handle(newFiles) {
    const arr = Array.from(newFiles);
    setFiles((prev) => (multiple ? [...prev, ...arr] : arr));
    onChange?.(multiple ? [...files, ...arr] : arr);
  }

  function remove(i) {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onChange?.(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${
          dragging ? 'border-secondary-container bg-secondary-container/10' : 'border-border-subtle hover:border-secondary-container/50'
        }`}
      >
        <span className="material-symbols-outlined text-[32px] text-text-secondary mb-2 block">cloud_upload</span>
        <p className="text-body-sm text-text-secondary">{label}</p>
        <p className="text-[11px] text-text-secondary mt-1">Click or drag & drop</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handle(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between bg-surface-variant/50 rounded px-3 py-2 text-body-sm">
              <span className="flex items-center gap-2 text-text-primary truncate">
                <span className="material-symbols-outlined text-[16px]">attach_file</span>
                {f.name}
              </span>
              <button onClick={() => remove(i)} className="text-text-secondary hover:text-accent-red ml-2">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
