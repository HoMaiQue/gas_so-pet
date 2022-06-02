import React from "react";

// Comment này nhận 2 props là Data và Name từ component cha

export default function RenderListCylinder(props) {
	return (
		<div>
			<p className="title-item-render">
				<span>Loại bình: {props.name}</span>
				<span className="number-cylinder">Số lượng: {props.data.length} </span>
			</p>
			{props.data.map((item, index) => {
				return (
					<p className="list-item-render">
						<span>
							{index + 1}. {props.name}
						</span>
						<span>{item.serialCylinder}</span>
						<span>
							{item.weightCylinder % 1 === 0
								? item.weightCylinder + ".0 Kg"
								: item.weightCylinder + " Kg"}
						</span>
						<span>
							{item.weightTurnback % 1 === 0
								? item.weightTurnback + ".0 Kg"
								: item.weightTurnback + " Kg"}
						</span>
					</p>
				);
			})}
		</div>
	);
}
