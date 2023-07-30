interface SubAPIContext<SubAPI> {

    apiBindings: SubAPI

    onBindIPCs: () => void

}

export default SubAPIContext;