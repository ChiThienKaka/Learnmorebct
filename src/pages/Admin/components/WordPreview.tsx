import React, { useEffect } from 'react';
import { renderAsync } from 'docx-preview';
import { useLocation } from 'react-router-dom';
interface Props {
  wordfileurlprop?: string;
}
function WordPreview(props: Props) {
  const {wordfileurlprop} = props;
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
    //truyền vào prop 
    if(wordfileurlprop){
        const fetchWordFileprop = async () => {
          const response = await fetch(wordfileurlprop);
          const blob = await response.blob();
          const container = document.getElementById('word-preview') || document.createElement('div');
          renderAsync(blob, container);
        };
        fetchWordFileprop();
    }
  }, [wordfileurlprop,wordFileUrl]);

  return <><div id="word-preview" /></>;
}

export default WordPreview;

  