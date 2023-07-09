import './Dockspace.css'

type Props = {
    children: JSX.Element | JSX.Element[]
}

const Dockspace = (props: Props) => {

    return (
        <div id="dockspace">
            {props.children}
        </div>
    );

}

export default Dockspace;