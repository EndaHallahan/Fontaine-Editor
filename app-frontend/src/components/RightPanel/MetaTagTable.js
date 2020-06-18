import React from "react";

const MetaTagTable = (props) => {
	return (
		<table>
			<caption>Metadata:</caption>
			<tbody>
				{
					props.tags.map((tag, i) => {
						let splitTag = tag.split(":");
						if (splitTag.length === 2) {
							return (
								<tr key={i}>
									<td>{splitTag[0]}</td>
									<td>{splitTag[1]}</td>
								</tr>
							);
						} else {
							return null;
						}
					})
				}
			</tbody>
		</table>
	);
}

export default MetaTagTable;