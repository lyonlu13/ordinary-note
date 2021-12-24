export default function when(value, determine) {
    return {
        case: (con, v) => {
            if (value === con || determine) {
                return when(value, determine || v)
            }
            else return when(value)
        },
        else: (v) => {
            console.log(determine);
            if (determine !== undefined) {
                console.log(`Got determine`);

                if (typeof determine === "function")
                    return determine()
                return determine
            } else if (typeof v === "function") {
                return v()
            }

            return v
        }
    }
}