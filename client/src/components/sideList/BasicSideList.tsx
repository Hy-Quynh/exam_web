import { List, Typography } from 'antd';
import './style.scss';

const data = [
  'Lập trình web (9)',
  'Lập trình mobile (9)',
  'Bảo mật (9)',
  'Giải tích B1 (9)',
  'Giải tích B2 (9)',
];
const { Paragraph } = Typography;

type BasicSideListProps = {
  headerColor?: string;
  headerText?: string;
};

const BasicSideList: React.FC<BasicSideListProps> = (props) => {
  return (
    <div className='custom-side-list'>
      <List
        header={
          <div
            className={`${props?.headerColor} text-white text-3xl py-[20px] text-left px-[20px] rounded-t-lg`}
          >
            {props?.headerText}
          </div>
        }
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item key={`side-list-${index}`}>
            <Paragraph className='!my-0 text-lg'>{item}</Paragraph>
          </List.Item>
        )}
      />
    </div>
  );
};

export default BasicSideList;
