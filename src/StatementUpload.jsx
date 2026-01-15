
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import bytes from 'bytes';

// Helper to hide the native input visually
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const onUploadChange = async (event) => {
  if (!event.target.files || event.target.files.length < 1) return;

  const formData = new FormData();

  //console.log(event.target.files);

  const file = event.target.files[0];

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  console.log(`UPLOAD: name='${file.name}' type='${file.type}' size=${bytes(file.size)} (max=${bytes(MAX_SIZE)}) lastModified=${new Date(file.lastModified).toISOString()} [1 of ${event.target.files.length}]`);

  if (file.size > MAX_SIZE) {
    alert("File is too large!");
    return;
  }

  formData.append('file', file);
  try {
    const response = await fetch('https://maria.alunw.com/statement', {
      method: 'POST',
      body: formData,
      // NOTE: Do NOT set "Content-Type" headers manually. 
      // The browser will automatically set it to 'multipart/form-data' 
      // with the correct "boundary" string.
    });

    if (response.ok) {
      console.log('Upload successful!');
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

export default function StatementUpload() {

  return (
    <Button
      component="label"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput
        type="file"
        onChange={onUploadChange}
        //multiple
        accept='.pdf'
      />
    </Button>
  );
}