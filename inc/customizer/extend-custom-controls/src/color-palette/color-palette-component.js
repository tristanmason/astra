import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import AstraColorPickerControl from '../common/astra-color-picker-control';

const ColorPaletteComponent = props => {

    const greeting = 'Hello Function Component!';
 
    return <>
      <div>
        <input type="radio" value="Male" name="gender" />
         	<AstraColorPickerControl
							color={ '#000000' }
							onChangeComplete={ ( color, backgroundType ) => this.handleChangeComplete( color, 'desktop' ) }
							backgroundType = { 'color' }
							allowGradient={ false }
							allowImage={ false }
						/>
        <input type="radio" value="Female" name="gender" /> Female
        <input type="radio" value="Other" name="gender" /> Other
      </div>
    </>;
};

ColorPaletteComponent.propTypes = {
	control: PropTypes.object.isRequired
};

// export default ColorPaletteComponent;   
export default React.memo( ColorPaletteComponent );