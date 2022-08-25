import styled from 'styled-components';
import { grey15 } from '../../style/colors';
import { EffektInput } from '../../style/elements/input.style';

export const SingleDonationWrapper = styled.div`
  width: 800px;
`;

export const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const KIDTextArrowSize = '12px';
export const KIDTextWrapper = styled.div`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: calc(50% - ${KIDTextArrowSize});
    bottom: -12px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: ${KIDTextArrowSize} ${KIDTextArrowSize} 0 ${KIDTextArrowSize};
    border-color: ${grey15} transparent transparent transparent;
  }
`;

export const ControlsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
`;

export const DonationInputElement = styled(EffektInput as any)`
  width: 90px;
`;
