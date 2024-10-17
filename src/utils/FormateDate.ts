const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const weekday = date.toLocaleString('default', { weekday: 'long' });

    return `${day} ${month} ${year}, ${weekday}`;
};

const dateFormator = (dateString: string) => {
    const now = new Date(dateString);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

    const returnString = `${hours} : ${minutes} : ${seconds} ${ampm}`;

    return returnString;
};

export { dateFormator };

export default formatDate;