import React from 'react'
const LoadingPlaceHolder = (props) => {
    const { rows, columns } = props;
    return (
        <>
            {Array.from({ length: rows ?? 8 }).map((_, index) => (
                <tr key={index}>
                    <td colSpan={columns ?? 6} className="placeholder-glow"><span className="col-12 placeholder"></span></td>
                </tr>
            ))}
        </>
    )
}
export default LoadingPlaceHolder;