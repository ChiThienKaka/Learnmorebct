import React, { useState } from 'react';
import { Form, Input, Button, Radio, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const CreateQuizForm = () => {
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''], // Giả sử có 4 lựa chọn
      correctAnswer: null
    }
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: null
      }
    ]);
  };

  const handleRemoveQuestion = (index:any) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index:any, value:any) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex:any, optionIndex:any, value:any) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex:any, value:any) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    console.log('Quiz data:', questions);
    // Gửi dữ liệu bài kiểm tra tới API backend
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      {questions.map((q, qIndex) => (
        <div key={qIndex} style={{ marginBottom: '20px' }}>
          <Form.Item label={`Question ${qIndex + 1}`}>
            <Input
              placeholder="Enter your question"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Options">
            <Space direction="vertical">
              {q.options.map((option, oIndex) => (
                <Input
                  key={oIndex}
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                />
              ))}
            </Space>
          </Form.Item>

          <Form.Item label="Correct Answer">
            <Radio.Group
              onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
              value={q.correctAnswer}
            >
              {q.options.map((option, oIndex) => (
                <Radio key={oIndex} value={oIndex}>
                  {`Option ${oIndex + 1}`}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Button
            type="dashed"
            icon={<MinusCircleOutlined />}
            onClick={() => handleRemoveQuestion(qIndex)}
          >
            Remove Question
          </Button>
        </div>
      ))}

      <Form.Item>
        <Button
          type="dashed"
          onClick={handleAddQuestion}
          icon={<PlusOutlined />}
          style={{ width: '100%' }}
        >
          Add Question
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Quiz
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateQuizForm;
