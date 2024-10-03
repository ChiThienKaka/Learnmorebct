// import React, { useState } from 'react';
// import { List, Button, Modal, Form, Input } from 'antd';

// const CreateLectureList = () => {
//   const [lectures, setLectures] = useState<any[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [newLecture, setNewLecture] = useState('');

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleOk = () => {
//     setLectures([...lectures, newLecture]);
//     setIsModalVisible(false);
//     setNewLecture('');
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   return (
//     <div>
//       <Button type="primary" onClick={showModal}>
//         Thêm bài giảng
//       </Button>

//       <Modal
//         title="Thêm bài giảng"
//         visible={isModalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         <Form>
//           <Form.Item label="Tên bài giảng">
//             <Input
//               value={newLecture}
//               onChange={(e) => setNewLecture(e.target.value)}
//               placeholder="Nhập tên bài giảng"
//             />
//           </Form.Item>
//         </Form>
//       </Modal>

//       <List
//         header={<div>Danh sách bài giảng</div>}
//         bordered
//         dataSource={lectures}
//         renderItem={(item) => (
//           <List.Item>
//             {item}
//             <Button type="link" danger onClick={() => setLectures(lectures.filter(lecture => lecture !== item))}>
//               Xóa
//             </Button>
//           </List.Item>
//         )}
//       />
//     </div>
//   );
// };

// export default CreateLectureList;
// import React from "react";
// import { List, Collapse, Button } from "antd";

// const { Panel } = Collapse;

// const data = [
//   {
//     title: "Bài học 1",
//     subLessons: [
//       { title: "Bài học con 1.1", content: "Nội dung bài học con 1.1" },
//       { title: "Bài học con 1.2", content: "Nội dung bài học con 1.2" },
//     ],
//   },
//   {
//     title: "Bài học 2",
//     subLessons: [
//       { title: "Bài học con 2.1", content: "Nội dung bài học con 2.1" },
//       { title: "Bài học con 2.2", content: "Nội dung bài học con 2.2" },
//     ],
//   },
// ];

// const CreateLectureList = () => {
//   return (
//     <List
//       dataSource={data}
//       renderItem={(item) => (
//         <List.Item>
//           <List.Item.Meta title={item.title} />
//           <Collapse>
//             <Panel header="Danh sách bài học con" key={item.title}>
//               <List
//                 dataSource={item.subLessons}
//                 renderItem={(subItem) => (
//                   <List.Item>
//                     <List.Item.Meta title={subItem.title} description={subItem.content} />
//                   </List.Item>
//                 )}
//               />
//             </Panel>
//           </Collapse>
//         </List.Item>
//       )}
//     />
//   );
// };

// export default CreateLectureList;

import { Menu, Steps } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const { Step } = Steps;

const CreateLectureList = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleMenuClick = (e: any) => {
    setSelectedCourse(e.key);
    setCurrentStep(0); // Reset bước về bước đầu tiên khi chọn khóa học mới
  };

  const steps = [
    {
      title: 'Giới thiệu',
      content: 'Nội dung giới thiệu khóa học',
    },
    {
      title: 'Chương 1',
      content: 'Nội dung chương 1',
    },
    {
      title: 'Chương 2',
      content: 'Nội dung chương 2',
    },
    {
      title: 'Tài liệu',
      content: 'Tài liệu khóa học',
    },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Menu
        onClick={handleMenuClick}
        style={{ width: 256 }}
        mode="vertical"
        defaultSelectedKeys={['course1']}
      >
        <Menu.Item key="course1" icon={<BookOutlined />}>
          Khóa học 1
        </Menu.Item>
        <Menu.Item key="course2" icon={<BookOutlined />}>
          Khóa học 2
        </Menu.Item>
        <Menu.Item key="course3" icon={<BookOutlined />}>
          Khóa học 3
        </Menu.Item>
      </Menu>

      {selectedCourse && (
        <div style={{ marginLeft: 16, width: '100%' }}>
          <Steps current={currentStep} onChange={(step) => setCurrentStep(step)}>
            {steps.map((item, index) => (
              <Step key={index} title={item.title} />
            ))}
          </Steps>
          <div style={{ marginTop: 16 }}>{steps[currentStep].content}</div>
        </div>
      )}
    </div>
  );
};

export default CreateLectureList;
