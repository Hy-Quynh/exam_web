import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { customUpload, validateFn } from '../../utils/upload-file';
import { message } from 'antd';
import 'react-quill/dist/quill.snow.css';

type QuillEditorProps = {
  initValue: string;
  handleChange: (value: string) => void;
  disabled?: boolean
};

function CustomQuillEditor({ initValue, handleChange, disabled }: QuillEditorProps) {
  const [value, setValue] = useState('');
  const reactQuillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (initValue) {
      setValue(initValue);
    }
  }, [initValue]);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const validate = validateFn(file);

        if (!validate) {
          message.error('File tải lên không thể hơn 500 kb');
        }

        const uploadUrl = await customUpload(file);

        if (!uploadUrl) {
          message.error('Upload file thất bại');
        }

        const quill = reactQuillRef.current;

        if (quill) {
          const range = quill.getEditorSelection();
          range &&
            quill.getEditor().insertEmbed(range.index, 'image', uploadUrl);
        }
      }
    };
  }, []);

  return (
    <ReactQuill
      ref={reactQuillRef}
      theme='snow'
      placeholder='Nhập vào câu hỏi'
      modules={{
        toolbar: {
          container: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['code-block'],
            ['clean'],
          ],
          handlers: {
            image: imageHandler,
          },
        },
        clipboard: {
          matchVisual: false,
        },
      }}
      formats={[
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
        'code-block',
      ]}
      value={value}
      onChange={(value) => {
        handleChange?.(value);
        setValue(value);
      }}
      readOnly={!!disabled}
    />
  );
}

export default CustomQuillEditor;
