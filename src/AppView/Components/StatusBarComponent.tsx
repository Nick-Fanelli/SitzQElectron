import { useProjectStore } from '../State/AppViewStore';
import './StatusBarComponent.css'

const StatusBarComponent = () => {

    const projectName = useProjectStore((state) => state.projectName);

    return (
        <section id="status-bar">
            <h1>{projectName}</h1>
        </section>
    )

}

export default StatusBarComponent;