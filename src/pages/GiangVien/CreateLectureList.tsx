
import React, { useState } from 'react';
import { Button, Radio, Card, Space, Input } from 'antd';
interface Answers {
  [key: number]: string;
}

const questions = [
  {
    key: '1',
    question: 'Câu hỏi 1: Màu sắc nào bạn thích?',
    options: ['Đỏ', 'Xanh', 'Vàng', 'Đen'],
  },
  {
    key: '2',
    question: 'Câu hỏi 2: Động vật nào bạn yêu thích?',
    options: ['Chó', 'Mèo', 'Hổ', 'Sư tử'],
  },
  {
    key: '3',
    question: 'Câu hỏi 3: Món ăn nào bạn thích?',
    options: ['Phở', 'Bánh mì', 'Pizza', 'Sushi'],
  },
];

const CreateLectureList = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);//câu hỏi được chọn
  const [answers, setAnswers] = useState<Answers>({}); //câu trả lời ghi nhận

  //Câu hỏi được chọn
  const handleQuestionClick = (question:any) => {
    setSelectedQuestion(question);
  };

  const handleAnswerChange = (value:any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [selectedQuestion.key]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Dữ liệu câu trả lời:', answers);
    // Xử lý gửi dữ liệu ở đây
  };
  const [text, setText] = useState('');

  const handleInputChange = (e:any) => {
    console.log(e.target.value)
    setText(e.target.value);
  };

  const render = (
    <Input 
      onChange={handleInputChange}  // Sửa thành onChange
      value={text}
      placeholder="Enter text"
    />
  );
  return (
    <div>
      <Space direction="vertical" style={{ marginBottom: 20 }}>
        {questions.map((question) => (
          <Button key={question.key} onClick={() => handleQuestionClick(question)}>
            {question.question}
          </Button>
        ))}
      </Space>

      {selectedQuestion && (
        <Card title={selectedQuestion.question} style={{ marginBottom: 20 }}>
          {/* value={answers[selectedQuestion.key]} */}
          <Radio.Group onChange={(e) => handleAnswerChange(e.target.value)} value={answers[selectedQuestion.key]}>
            {selectedQuestion.options.map((option:any) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
            {render}
        </Card>
      )}

      {selectedQuestion && (
        <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
          Gửi
        </Button>
      )}
    </div>
  );
};

export default CreateLectureList;
