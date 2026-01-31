import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

type MulterFile = Express.Multer.File;

// ========================================
// UPLOAD IMAGE FUNCTION
// ========================================

export async function uploadImage(
    supabase: SupabaseClient,
    file: MulterFile,
    folder: string,
    fileUrl?: string,
): Promise<string> {

    // 1. Validate MIME type
    const mime = file.mimetype;
    if (!mime) throw new Error("File type is missing");

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(mime)) {
        throw new Error(
            "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
        );
    }

    // 2. Extract file extension
    const ext = mime.split("/")[1]; // "image/jpeg" -> "jpeg"

    // 3. Delete old image if updating
    if (fileUrl) {
        await deleteImage(supabase, fileUrl);
    }

    // 4. Generate unique filename
    const filename: string = `${uuidv4()}.${ext}`;
    const filePath = `${folder}/${filename}`; // "Inventory/uuid.jpg"

    // 5. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from("Grievance") // BUCKET NAME
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    // 6. Get public URL
    const { data: urlData } = supabase.storage
        .from("Grievance")
        .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL");
    }

    // 7. Return public URL
    return urlData.publicUrl;
}

// ========================================
// DELETE IMAGE FUNCTION
// ========================================

export async function deleteImage(
    supabase: SupabaseClient,
    fileUrl: string,
): Promise<void> {

    const { filePath } = extractFilePathAndNameFromUrl(fileUrl);

    const { error: deleteError } = await supabase.storage
        .from("Grievance")
        .remove([filePath]);

    if (deleteError) {
        throw new Error(`Image deletion failed: ${deleteError.message}`);
    }
}

// ========================================
// HELPER: EXTRACT FILE PATH FROM URL
// ========================================

function extractFilePathAndNameFromUrl(fileUrl: string): {
    filePath: string;
    fileName: string;
} {
    try {
        const url = new URL(fileUrl);
        // URL: https://xxx.supabase.co/storage/v1/object/public/Grievance/Inventory/uuid.jpg
        const pathParts = url.pathname.split("/");
        // ['', 'storage', 'v1', 'object', 'public', 'Grievance', 'Inventory', 'uuid.jpg']
        const filePath = pathParts.slice(6).join("/"); // "Inventory/uuid.jpg"

        if (!filePath) throw new Error("Invalid file URL");

        const fileName = filePath.split("/").pop() || "";
        return { filePath, fileName };
    } catch {
        throw new Error("Invalid file URL");
    }
}
