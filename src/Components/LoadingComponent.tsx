import './LoadingComponent.css'

type Props = {

    size?: string
    loadingText?: string,
    autoHeight?: boolean

}

const DefaultSize = "100px";

const LoadingComponent = (props: Props) => {

    const size = props.size || DefaultSize;

    return (

        <div className="loading-component">
            <div className="loading-ripple" style={{ width: size, height: props.autoHeight ? 0 : size, paddingBottom: props.autoHeight ? size : 0 }}>
                <div></div>
                <div></div>
            </div>
            {
                props.loadingText ? 
                <h1>{props.loadingText}</h1>
                : null
            }
        </div>
    )

}

export default LoadingComponent;