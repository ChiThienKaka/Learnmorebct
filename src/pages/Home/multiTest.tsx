import { useState } from 'react';
import { Radio, Button } from 'antd';
import React from 'react';

const QuestionCreator = () => {
  const [questionType, setQuestionType] = useState(null);

  const handleTypeChange = (e:any) => {
    setQuestionType(e.target.value);
  };

  return (
    <div>
      <Radio.Group onChange={handleTypeChange}>
        <Radio value="multipleChoice">Trắc nghiệm</Radio>
        <Radio value="essay">Tự luận</Radio>
      </Radio.Group>

      <div style={{ marginTop: '20px' }}>
        {questionType === 'multipleChoice' && <MultipleChoiceForm />}
        {questionType === 'essay' && <EssayForm />}
      </div>
    </div>
  );
};

const MultipleChoiceForm = () => (
  <div>
    {/* Form nhập câu hỏi trắc nghiệm */}
    <p>Nhập câu hỏi trắc nghiệm và các lựa chọn:</p>
    <input type="text" placeholder="Câu hỏi" />
    <input type="text" placeholder="Lựa chọn 1" />
    <input type="text" placeholder="Lựa chọn 2" />
    <input type="text" placeholder="Lựa chọn 3" />
    <input type="text" placeholder="Lựa chọn 4" />
    <Button type="primary">Lưu câu hỏi trắc nghiệm</Button>
  </div>
);

const EssayForm = () => (
  <div>
    {/* Form nhập câu hỏi tự luận */}
    <p>Nhập câu hỏi tự luận:</p>
    <input type="text" placeholder="Câu hỏi tự luận" />
    <Button type="primary">Lưu câu hỏi tự luận</Button>
  </div>
);

export default QuestionCreator;
