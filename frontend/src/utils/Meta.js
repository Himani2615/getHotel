import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description }) => {

    return (
        <Helmet>
            <title>GetHotel</title>
            <meta name="description" content={!description ? "Hotel Booking Application" : description} />
        </Helmet>
    )
}
export default Meta;