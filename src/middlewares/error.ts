const error = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err);
    }
}

export default error;