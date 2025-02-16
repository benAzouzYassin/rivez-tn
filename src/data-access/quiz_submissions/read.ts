import { supabase } from "@/lib/supabase-client-side"
import { Database } from "@/types/database.types"

export async function readSubmissionsWithAllData(config?: {
    filters?: {
        username?: string | null
    }
    pagination?: {
        currentPage: number
        itemsPerPage: number
    }
}) {
    const isFiltering = !!config?.filters?.username

    if (config) {
        if (config?.pagination && !isFiltering) {
            const response = await supabase
                .from("quiz_submissions")
                .select(`*, quiz(*), user(*)`, {
                    count: "exact",
                })
                .range(
                    (config.pagination.currentPage - 1) *
                        config.pagination.itemsPerPage,
                    config.pagination.currentPage *
                        config.pagination.itemsPerPage -
                        1
                )
                .order("created_at", {
                    ascending: false,
                })
                .throwOnError()
            const data = response.data
            return { data: response.data, count: response.count }
        }
    }

    const response = await supabase
        .from("quiz_submissions")
        .select(`*`)
        // .ilike("name", `%${config?.filters?.name || ""}%`)
        .order("created_at", {
            ascending: false,
        })
        .throwOnError()
    return { data: response.data, count: response.count }
}
// {
//     "id": 1,
//     "created_at": "2025-02-15T21:37:55.557045+00:00",
//     "seconds_spent": 14.244,
//     "quiz": {
//         "id": 1,
//         "name": "JavaScript Variables & Types",
//         "image": "https://dev.files.softyeducation.com/api/website_courses_icons_react_js-1337a72a-dcae-45fa-967e-64998bce5198.png",
//         "category": 1,
//         "author_id": null,
//         "created_at": "2025-02-15T20:42:00.116233+00:00",
//         "description": "",
//         "publishing_status": "PUBLISHED"
//     },
//     "user": {
//         "email": "yassinebenazouz123@gmail.com",
//         "phone": "",
//         "user_id": "ee64e022-c43c-4391-a6e1-b29667e2eb01",
//         "username": "yassinebenazouz123",
//         "full_name": "yassine benazouz",
//         "user_role": "ADMIN",
//         "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocIYORLxSS9hdloKjc0uSs42ALQbnavT5CNDoNL_X7zevoJsGwk=s96-c",
//         "created_at": "2025-02-15T20:43:51.64594+00:00"
//     }
// }
