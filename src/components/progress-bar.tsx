const ProgressBar = (props:any) => {
    const { completed } = props;
  
    const containerStyles = {
      height: 20,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      margin: 50
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: '#00f5ff',
      borderRadius: 'inherit',
    }
  
    const labelStyles = {
      padding: 5,
      color: 'black',
      fontWeight: 'bold',
      paddingRight: '10px'
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${completed}%`}</span>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;