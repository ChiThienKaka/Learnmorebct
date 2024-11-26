import { Input } from "antd";
import React, { memo } from "react";

interface Props {
  value?: string | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

const InputMemo = (props: Props) => {
  const { value, onChange } = props;

  // Đảm bảo rằng hàm onChange luôn có, nếu không truyền thì dùng hàm rỗng
  return <Input onChange={onChange ?? (() => {})} value={value} />;
};

export default memo(InputMemo);
