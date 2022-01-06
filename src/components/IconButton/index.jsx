import styled from 'styled-components';
import Icon from 'components/Icon';

const Btn = styled.span`
  display: inline-flex;
  align-items:center;
  justify-content:center;
  width: 30px;
  height:30px;
  background-color:white;
  border-radius:2px;
  transition:0.3s;
  & svg{
    fill:${props => props.color};
    transition:0.3s;
  }
  &:hover{
    background-color:${props => props.color};
    & svg{
      fill:white;
    }
  }

`

export default function IconButton({ onClick, color, icon }) {
    return (<Btn color={color} onClick={onClick}>
        <Icon icon={icon} />
    </Btn>);
}