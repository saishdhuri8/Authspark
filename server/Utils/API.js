export const callAtURL = async (user, url) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: user }),
        })
        return true;
    } catch (error) {
        return false;
    }
}