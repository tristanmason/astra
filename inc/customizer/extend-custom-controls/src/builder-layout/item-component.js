const {Dashicon, Button} = wp.components;


const ItemComponent = props => {

	let choices = (AstraBuilderCustomizerData && AstraBuilderCustomizerData.choices && AstraBuilderCustomizerData.choices[props.controlParams.group] ? AstraBuilderCustomizerData.choices[props.controlParams.group] : []);


	return <div className="ahfb-builder-item" data-id={props.item}
				data-section={undefined !== choices[props.item] && undefined !== choices[props.item].section ? choices[props.item].section : ''}
				key={props.item} onClick={() => {
		props.focusItem(undefined !== choices[props.item] && undefined !== choices[props.item].section ? choices[props.item].section : '');
	}}>
				<span className="ahfb-builder-item-text">
					{undefined !== choices[props.item] && undefined !== choices[props.item].name ? choices[props.item].name : ''}
				</span>
		{
			choices[props.item]['clone'] &&

			<div className="ast-slideup">
				<span title="Clone"
					  onClick={e => {
						  e.stopPropagation();
						  props.cloneItem(props.item);
					  }} className=" tooltip dashicons dashicons-admin-page">
				</span>
				<span title="Reset to default"
					  onClick={e => {
						  e.stopPropagation();
						  var event = new CustomEvent('AstraBuilderResetSectionControls', {
							  'detail': {
							  	'section_id': choices[props.item].section
							  }
						  });
						  document.dispatchEvent(event);
					  }}
					  className=" tooltip dashicons dashicons-image-rotate">
				</span>
				<span title="Delete"
					  onClick={e => {
						  e.stopPropagation();
						  sessionStorage.setItem('forceRemoveComponent',  JSON.stringify(choices[props.item])  )
						  delete choices[props.item];
						  props.removeItem(props.item);

					  }}
					  className="tooltip dashicons dashicons-trash">
				</span>
			</div>
		}

		<Button className="ahfb-builder-item-icon" onClick={e => {
			e.stopPropagation();
			props.removeItem(props.item);
		}}>
			<Dashicon icon="no-alt"/>
		</Button>
	</div>;
};
export default ItemComponent;
