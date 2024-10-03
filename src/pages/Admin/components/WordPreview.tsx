import React, { useEffect } from 'react';
import { renderAsync } from 'docx-preview';
import { useLocation } from 'react-router-dom';

function WordPreview() {
  const location = useLocation();
  const wordFileUrl = location.state?.wordFileUrl;  // Lấy giá trị từ navigate
  useEffect(() => {
    if(wordFileUrl){
      const fetchWordFile = async () => {
        const response = await fetch(wordFileUrl);
        const blob = await response.blob();
        const container = document.getElementById('word-preview') || document.createElement('div');
        renderAsync(blob, container);
      };
      fetchWordFile();
    }
  }, [wordFileUrl]);

  return <><div id="word-preview" /></>;
}

export default WordPreview;

  