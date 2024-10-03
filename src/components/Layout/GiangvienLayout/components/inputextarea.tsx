import './index.css'
interface Props{
    rows: number,
    onChange: (e:any) => any,
    onClick: (e:any) => any,
    id: string
}
function InputTextArea(props:Props) {
    const {rows, onChange,onClick, id} = props;
    return ( 
        <textarea maxLength={200}  className='custom-textarea' id={id} rows={rows} onChange={onChange} onClick={onClick} ></textarea>
     );
}

export default InputTextArea;