import Colors from './colors'

export const hoverWithShadow = ({ transition, color } = { transition: 0.3, color: Colors.borderGray }) => `
    transition: box-shadow ${transition}s;
    &:hover {
        box-shadow: 0px 1px 1px 1px ${color};
    }
`
export const hoverWithColorChange = ({ transition, color } = { transition: 0.3, color: Colors.borderGray }) => `
    transition: color ${transition}s;
    &:hover {
        color: ${color}
    }
`