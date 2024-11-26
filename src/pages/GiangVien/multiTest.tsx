import React, { useState } from 'react';
import { Button, Form, Input, Radio, Space, Tabs } from 'antd';
import type { TabsProps } from 'antd';



const MultiTes: React.FC = () => {
    const onChange = (key: string) => {
        console.log(key);
      };
      
      const [form] = Form.useForm();
        const [choices, setChoices] = useState<any[]>(['', '', '', '']);
        const [correctAnswer, setCorrectAnswer] = useState(null);
      
        const handleChoiceChange = (index:any, e:any) => {
          const newChoices = [...choices];
          newChoices[index] = e.target.value;
          setChoices(newChoices);
        };
      
        const handleFinish = (values:any) => {
          console.log('Form values: ', values);
          // Xử lý logic lưu trữ hoặc submit form tại đây
        };
      const items: TabsProps['items'] = [
        {
          key: '1',
          label: 'Câu hỏi trắc nghiệm',
          children: <>
              {/* Form tạo câu hỏi trắc nghiệm  */}
              <Form form={form} layout="vertical" onFinish={handleFinish}>
            {/* Câu hỏi */}
            <Form.Item
              label="Câu hỏi"
              name="question"
              rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
            >
              <Input.TextArea placeholder="Nhập câu hỏi của bạn" />
            </Form.Item>
      
            {/* Các lựa chọn */}
            {choices.map((choice, index) => (
              <Form.Item
                key={index}
                label={`Lựa chọn ${index + 1}`}
                name={`choice_${index}`}
                rules={[{ required: true, message: `Vui lòng nhập lựa chọn ${index + 1}` }]}
              >
                <Input
                  placeholder={`Nhập lựa chọn ${index + 1}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e)}
                />
              </Form.Item>
            ))}
      
            {/* Đáp án đúng */}
            <Form.Item
              label="Đáp án đúng"
              name="correctAnswer"
              rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
            >
              <Radio.Group onChange={(e) => setCorrectAnswer(e.target.value)}>
                <Space direction="vertical">
                  {choices.map((choice, index) => (
                    <Radio key={index} value={index}>
                      {`Lựa chọn ${index + 1}`}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
      
            {/* Nút Submit */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Tạo câu hỏi
              </Button>
            </Form.Item>
          </Form>
          </>,
        },
        {
          key: '2',
          label: 'Câu hỏi tự luận',
          children: <>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
      {/* Câu hỏi tự luận */}
      <Form.Item
        label="Câu hỏi tự luận"
        name="question"
        rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
      >
        <Input.TextArea placeholder="Nhập câu hỏi tự luận của bạn" />
      </Form.Item>

      {/* Đáp án mẫu */}
      <Form.Item
        label="Đáp án mẫu"
        name="sampleAnswer"
        rules={[{ required: true, message: 'Vui lòng nhập đáp án mẫu!' }]}
      >
        <Input.TextArea placeholder="Nhập đáp án mẫu cho câu hỏi này" />
      </Form.Item>

      {/* Nút Submit */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Tạo câu hỏi
        </Button>
      </Form.Item>
    </Form>
          </>,
        }
      ];
    return (
        <div style={{padding:20}}>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
    )
};

export default MultiTes;