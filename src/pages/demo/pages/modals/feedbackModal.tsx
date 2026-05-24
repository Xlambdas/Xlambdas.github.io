import React, { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';
import { CloseIcon } from "../../constants/icons/icons";

interface FeedbackModalProps {
    onClose: () => void;
    from?: string;
}

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_3duo75u"; // e.g., "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_lkec7tl"; // e.g., "template_xyz789"
const EMAILJS_PUBLIC_KEY = "trB5S_O1DA1BA0HY6"; // e.g., "abc123xyz789"

// Icons for categories
const BugIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
    </svg>
);

const FeatureIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const ChatIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

// Track feedback submissions
const trackFeedbackSubmission = () => {
    const submissions = JSON.parse(localStorage.getItem("feedback_submissions") || "[]");
    submissions.push(Date.now());
    localStorage.setItem("feedback_submissions", JSON.stringify(submissions));
};

const getFeedbackCount = () => {
    const submissions = JSON.parse(localStorage.getItem("feedback_submissions") || "[]");
    const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentSubmissions = submissions.filter((timestamp: number) => timestamp > oneMonthAgo);

    // Clean up old submissions
    localStorage.setItem("feedback_submissions", JSON.stringify(recentSubmissions));

    return recentSubmissions.length;
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, from }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");
    const [category, setCategory] = useState<"bug" | "feature" | "other">("bug");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // Dragging state
    const [position, setPosition] = useState(() => {
        const isMobile = window.innerWidth < 640;
        return isMobile
            ? { x: 16, y: 16 }
            : { x: window.innerWidth - 520, y: 100 };
    });
    const [size, setSize] = useState(() => {
        const isMobile = window.innerWidth < 640;
        return isMobile
            ? { width: window.innerWidth - 32, height: window.innerHeight - 32 }
            : { width: 420, height: 600 };
    });
    // const [size, setSize] = useState(() => {
    //     const savedSize = localStorage.getItem("feedback_modal_size");
    //     return savedSize ? JSON.parse(savedSize) : { width: 420, height: 600 };
    // });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string>("");
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    // const [isModalHidden, setIsModalHidden] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Load saved name/email from localStorage
    useEffect(() => {
        const savedName = localStorage.getItem("feedback_name") || "";
        const savedEmail = localStorage.getItem("feedback_email") || "";
        setName(savedName);
        setEmail(savedEmail);
    }, []);

    // Handle drag start
    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName === 'INPUT' ||
            (e.target as HTMLElement).tagName === 'TEXTAREA' ||
            (e.target as HTMLElement).tagName === 'BUTTON') {
            return;
        }

        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    // Handle dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            // Keep modal within viewport bounds
            const modalWidth = modalRef.current?.offsetWidth || 420;
            const modalHeight = modalRef.current?.offsetHeight || 500;

            const boundedX = Math.max(0, Math.min(newX, window.innerWidth - modalWidth));
            const boundedY = Math.max(0, Math.min(newY, window.innerHeight - modalHeight));

            setPosition({ x: boundedX, y: boundedY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        if (window.innerWidth < 640) return; // Disable on mobile
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);
        setDragOffset({
            x: e.clientX,
            y: e.clientY,
        });
    };

    // Handle resizing
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizing) {
                const deltaX = e.clientX - dragOffset.x;
                const deltaY = e.clientY - dragOffset.y;

                setSize((prev: { width: number; height: number }) => {
                    let newWidth = prev.width;
                    let newHeight = prev.height;
                    let newX = position.x;
                    let newY = position.y;

                    // Handle different resize directions
                    if (resizeDirection.includes('e')) {
                        newWidth = Math.max(350, Math.min(800, prev.width + deltaX));
                    }
                    if (resizeDirection.includes('w')) {
                        const widthChange = prev.width - deltaX;
                        if (widthChange >= 350 && widthChange <= 800) {
                            newWidth = widthChange;
                            newX = position.x + deltaX;
                        }
                    }
                    if (resizeDirection.includes('s')) {
                        newHeight = Math.max(400, Math.min(900, prev.height + deltaY));
                    }
                    if (resizeDirection.includes('n')) {
                        const heightChange = prev.height - deltaY;
                        if (heightChange >= 400 && heightChange <= 900) {
                            newHeight = heightChange;
                            newY = position.y + deltaY;
                        }
                    }

                    // Update position if needed (for north/west resizing)
                    if (newX !== position.x || newY !== position.y) {
                        setPosition({ x: newX, y: newY });
                    }

                    return { width: newWidth, height: newHeight };
                });

                setDragOffset({ x: e.clientX, y: e.clientY });
            }
        };

        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
                // Save size to localStorage
                localStorage.setItem("feedback_modal_size", JSON.stringify(size));
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, dragOffset, resizeDirection, size, position]);

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setErrorMessage("L'image est trop grande (max 2MB)");
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            setErrorMessage("Veuillez sélectionner une image");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setUploadedImage(event.target?.result as string);
            setErrorMessage("");
        };
        reader.readAsDataURL(file);
    };

    // Remove uploaded image
    const removeUploadedImage = () => {
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Remove screenshot
    const removeScreenshot = () => {
        setScreenshot(null);
    };

    // Handle paste event for screenshots
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (!blob) continue;

                    // Check file size (max 2MB)
                    if (blob.size > 2 * 1024 * 1024) {
                        setErrorMessage("L'image est trop grande (max 2MB)");
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setScreenshot(event.target?.result as string);
                        setErrorMessage("");
                    };
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!feedback.trim()) {
            setErrorMessage("Veuillez écrire votre feedback");
            return;
        }

        setStatus("sending");
        setErrorMessage("");

        // Save name/email to localStorage
        if (name) localStorage.setItem("feedback_name", name);
        if (email) localStorage.setItem("feedback_email", email);

        // Prepare email parameters
        let messageWithImages = feedback;

        if (screenshot) {
            messageWithImages += '\n\n--- Screenshot de l\'élément sélectionné ---\n(Image jointe)';
        }
        if (uploadedImage) {
            messageWithImages += '\n\n--- Image téléchargée ---\n(Image jointe)';
        }

        const templateParams = {
            from_name: name || "Anonymous",
            from_email: email || "No email provided",
            category: category === "bug" ? "Bug Report" : category === "feature" ? "Feature Request" : "Other",
            message: messageWithImages,
            date: new Date().toLocaleString("fr-FR"),
            screenshot: screenshot || "Pas de screenshot",
            uploaded_image: uploadedImage || "Pas d'image",
            from_page: from || "Unknown",
        };

        try {
            // Send email via EmailJS
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            // Track successful submission
            trackFeedbackSubmission();

            setStatus("success");

            // Clear feedback field but keep name/email
            setFeedback("");

            // Auto-close after 3 seconds (more time to read message)
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error: any) {
            console.error("EmailJS error:", error);
            setStatus("error");

            // Check if it's a quota error
            if (error?.status === 429 || error?.text?.includes("quota") || error?.text?.includes("limit")) {
                setErrorMessage("Limite mensuelle atteinte. Envoyez-nous un email directement à : contact@xls-studio.com");
            } else {
                setErrorMessage("Erreur lors de l'envoi. Veuillez réessayer.");
            }
        }
    };

    return (
        <>
            {/* Backdrop - semi-transparent, doesn't block clicks */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.2)",
                    zIndex: 9998,
                    pointerEvents: "none", // Don't block clicks on other elements
                    animation: "fadeIn 0.2s ease",
                }}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="feedback-modal"
                style={{
                    position: "fixed",
                    top: position.y,
                    left: position.x,
                    width: size.width,
                    height: size.height,
                    maxWidth: "calc(100vw - 32px)",
                    maxHeight: "calc(100vh - 32px)",
                    background: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: 12,
                    boxShadow: isDragging
                        ? "0 24px 64px rgba(0,0,0,0.8)"
                        : "0 16px 48px rgba(0,0,0,0.6)",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideUp 0.25s ease",
                    cursor: isDragging ? "grabbing" : "default",
                    transition: isDragging ? "none" : "box-shadow 0.2s ease",
                }}
            >
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    /* Mobile adjustments */
                    @media (max-width: 640px) {
                        .feedback-modal {
                            border-radius: 12px !important;
                        }

                        /* Prevent zoom on input focus - font must be 16px minimum */
                        .feedback-modal input,
                        .feedback-modal textarea {
                            font-size: 16px !important;
                        }

                        .feedback-modal label {
                            font-size: 12px !important;
                        }
                    }

                    /* Prevent autofill styling */
                    input:-webkit-autofill,
                    input:-webkit-autofill,
                    input:-webkit-autofill:hover,
                    input:-webkit-autofill:focus {
                        -webkit-text-fill-color: #c9d1d9 !important;
                        -webkit-box-shadow: 0 0 0px 1000px #0d1117 inset !important;
                        transition: background-color 5000s ease-in-out 0s;
                    }
                `}</style>

                {/* Header - Drag Handle */}
                <div
                    onMouseDown={window.innerWidth >= 640 ? handleMouseDown : undefined}
                    style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #21262d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: isDragging ? "grabbing" : "grab",
                        userSelect: "none",
                    }}
                >
                    <div>
                        <h2 style={{
                            color: "#c9d1d9",
                            fontSize: 16,
                            fontWeight: 700,
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            Feedback
                        </h2>
                        <p
                            className="hidden sm:block"
                            style={{
                                color: "#8b949e",
                                fontSize: 11,
                                margin: "4px 0 0 0",
                            }}
                        >
                            Déplaçable • Cliquez pour bouger
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#484f58",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 6,
                            transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#21262d";
                            e.currentTarget.style.color = "#8b949e";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.color = "#484f58";
                        }}
                    >
                        <CloseIcon size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    padding: "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    minHeight: 0, // Important for flex overflow
                }}>
                    {/* Category Selection */}
                    <div>
                        <label style={{
                            color: "#8b949e",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            Catégorie
                        </label>
                        <div style={{ display: "flex", gap: 8 }}>
                            {[
                                { value: "bug" as const, label: "Bug", color: "#ef4444", Icon: BugIcon },
                                { value: "feature" as const, label: "Feature", color: "#a5b4fc", Icon: FeatureIcon },
                                { value: "other" as const, label: "Autre", color: "#8b949e", Icon: ChatIcon },
                            ].map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setCategory(cat.value)}
                                    style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        background: category === cat.value
                                            ? `${cat.color}15`
                                            : "#0d1117",
                                        border: `1px solid ${category === cat.value
                                            ? cat.color
                                            : "#21262d"}`,
                                        borderRadius: 8,
                                        color: category === cat.value ? cat.color : "#8b949e",
                                        fontSize: 11,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 6,
                                    }}
                                >
                                    <cat.Icon size={14} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name (Optional) */}
                    <div>
                        <label style={{
                            color: "#8b949e",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            Nom (optionnel)
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Votre nom"
                            style={{
                                width: "100%",
                                background: "#0d1117",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                padding: "9px 12px",
                                color: "#c9d1d9",
                                fontSize: 13,
                                outline: "none",
                                transition: "all 0.15s ease",
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = "#8b949e"}
                            onBlur={(e) => e.currentTarget.style.borderColor = "#30363d"}
                        />
                    </div>

                    {/* Email (Optional) */}
                    <div>
                        <label style={{
                            color: "#8b949e",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            Email (optionnel)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contact@xls-studio.com"
                            autoComplete="email"
                            style={{
                                width: "100%",
                                background: "#0d1117",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                padding: "9px 12px",
                                color: "#c9d1d9",
                                fontSize: 13,
                                outline: "none",
                                transition: "all 0.15s ease",
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = "#8b949e"}
                            onBlur={(e) => e.currentTarget.style.borderColor = "#30363d"}
                        />
                    </div>

                    {/* Feedback Textarea */}
                    <div style={{ flex: 1 }}>
                        <label style={{
                            color: "#8b949e",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            Message <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Décrivez votre bug, suggestion ou commentaire..."
                            required
                            style={{
                                width: "100%",
                                minHeight: 100,
                                background: "#0d1117",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                padding: "10px 12px",
                                color: "#c9d1d9",
                                fontSize: 13,
                                outline: "none",
                                resize: "vertical",
                                fontFamily: "inherit",
                                lineHeight: 1.5,
                                transition: "all 0.15s ease",
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = "#8b949e"}
                            onBlur={(e) => e.currentTarget.style.borderColor = "#30363d"}
                        />
                    </div>

                    {/* Image Attachments */}
                    <div>
                        <label style={{
                            color: "#8b949e",
                            fontSize: 11,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            Images (optionnel)
                        </label>

                        <div
                            className="hidden sm:block"
                            style={{
                                background: screenshot ? "rgba(165,180,252,0.08)" : "#0d1117",
                                border: `1px dashed ${screenshot ? "#a5b4fc" : "#30363d"}`,
                                borderRadius: 8,
                                padding: "12px",
                                marginBottom: 8,
                                textAlign: "center",
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                marginBottom: 6,
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={screenshot ? "#a5b4fc" : "#8b949e"} strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span style={{
                                    color: screenshot ? "#a5b4fc" : "#8b949e",
                                    fontSize: 12,
                                    fontWeight: 600,
                                }}>
                                    {screenshot ? "✓ Capture collée" : "Coller une capture (Ctrl+V / Cmd+V)"}
                                </span>
                            </div>
                            <div style={{
                                color: "#6e7681",
                                fontSize: 10,
                                lineHeight: 1.4,
                            }}>
                                Prenez une capture d'écran et collez-la ici
                            </div>
                        </div>

                        <div className="flex gap-2">

                            {/* Upload Image Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1"
                                style={{
                                    padding: "10px 12px",
                                    background: uploadedImage ? "rgba(165,180,252,0.12)" : "#0d1117",
                                    border: `1px solid ${uploadedImage ? "#a5b4fc" : "#30363d"}`,
                                    borderRadius: 8,
                                    color: uploadedImage ? "#a5b4fc" : "#8b949e",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (!uploadedImage) {
                                        e.currentTarget.style.background = "#161b22";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!uploadedImage) {
                                        e.currentTarget.style.background = "#0d1117";
                                    }
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                {uploadedImage ? "✓ Image" : "Télécharger"}
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: "none" }}
                            />
                        </div>

                        {/* Image Previews */}
                        {(screenshot || uploadedImage) && (
                            <div style={{
                                marginTop: 8,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}>
                                {screenshot && (
                                    <div style={{
                                        position: "relative",
                                        background: "#0d1117",
                                        border: "1px solid #30363d",
                                        borderRadius: 8,
                                        padding: 8,
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: 6,
                                        }}>
                                            <span style={{ color: "#8b949e", fontSize: 10, fontWeight: 600 }}>
                                                Screenshot de l'élément
                                            </span>
                                            <button
                                                type="button"
                                                onClick={removeScreenshot}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#ef4444",
                                                    cursor: "pointer",
                                                    padding: 2,
                                                    fontSize: 10,
                                                }}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                        <img
                                            src={screenshot}
                                            alt="Screenshot"
                                            style={{
                                                width: "100%",
                                                borderRadius: 6,
                                                border: "1px solid #21262d",
                                            }}
                                        />
                                    </div>
                                )}

                                {uploadedImage && (
                                    <div style={{
                                        position: "relative",
                                        background: "#0d1117",
                                        border: "1px solid #30363d",
                                        borderRadius: 8,
                                        padding: 8,
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: 6,
                                        }}>
                                            <span style={{ color: "#8b949e", fontSize: 10, fontWeight: 600 }}>
                                                Image téléchargée
                                            </span>
                                            <button
                                                type="button"
                                                onClick={removeUploadedImage}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#ef4444",
                                                    cursor: "pointer",
                                                    padding: 2,
                                                    fontSize: 10,
                                                }}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded"
                                            style={{
                                                width: "100%",
                                                borderRadius: 6,
                                                border: "1px solid #21262d",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: 8,
                            padding: "10px 12px",
                            color: "#ef4444",
                            fontSize: 11,
                            lineHeight: 1.5,
                        }}>
                            {errorMessage.includes("contact@") ? (
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                        Limite mensuelle atteinte pour l'ensemble des utilisateurs.
                                    </div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: errorMessage.replace(
                                                /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
                                                '<a href="mailto:$1?subject=Feedback" style="color: #ef4444; font-weight: 600; text-decoration: underline;">$1</a>'
                                            )
                                        }}
                                    />
                                </div>
                            ) : (
                                errorMessage
                            )}
                        </div>
                    )}

                    {/* Success Message */}
                    {status === "success" && (
                        <div>
                            <div style={{
                                background: "rgba(34,197,94,0.1)",
                                border: "1px solid rgba(34,197,94,0.3)",
                                borderRadius: 8,
                                padding: "12px 14px",
                                color: "#22c55e",
                                fontSize: 12,
                                textAlign: "center",
                                marginBottom: getFeedbackCount() >= 7 ? 10 : 0,
                            }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                    ✓ Merci pour votre feedback !
                                </div>
                                <div style={{ fontSize: 11, color: "#4ade80" }}>
                                    Votre retour nous aide à améliorer l'expérience
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Frequent feedback notice */}
                    {getFeedbackCount() >= 7 && (
                        <div style={{
                            background: "rgba(165,180,252,0.08)",
                            border: "1px solid rgba(165,180,252,0.25)",
                            borderRadius: 8,
                            padding: "10px 12px",
                            color: "#a5b4fc",
                            fontSize: 11,
                            lineHeight: 1.5,
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                Vous êtes très actif !
                            </div>
                            <div style={{ color: "#8b9dfc" }}>
                                Pour des retours plus détaillés, vous pouvez nous contacter directement à{" "}
                                <a
                                    href="mailto:contact@xls-studio.com?subject=Feedback%20détaillé"
                                    style={{
                                        color: "#a5b4fc",
                                        fontWeight: 600,
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = "#c9d1ff"}
                                    onMouseLeave={(e) => e.currentTarget.style.color = "#a5b4fc"}
                                >
                                    contact@xls-studio.com
                                </a>
                                {" "}ou regrouper vos suggestions.
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={status === "sending" || status === "success"}
                        style={{
                            width: "100%",
                            padding: "11px",
                            background: status === "sending" || status === "success"
                                ? "#30363d"
                                : "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)",
                            border: "none",
                            borderRadius: 8,
                            color: status === "sending" || status === "success" ? "#6e7681" : "#0d1117",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: status === "sending" || status === "success" ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            opacity: status === "sending" || status === "success" ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (status === "idle" || status === "error") {
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(165,180,252,0.4)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {status === "sending" ? "Envoi en cours..." : status === "success" ? "Envoyé ✓" : "Envoyer le feedback"}
                    </button>
                </form>

                {/* Resize Handles - Desktop only */}
                {window.innerWidth >= 640 && (
                    <>
                    {/* Resize Handles */}
                    {/* Corner handles */}
                    {/* <div
                        onMouseDown={(e) => handleResizeStart(e, 'se')}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 16,
                            height: 16,
                            cursor: 'se-resize',
                            zIndex: 10,
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            style={{
                                position: 'absolute',
                                bottom: 2,
                                right: 2,
                                opacity: 0.5,
                            }}
                        >
                            <path
                                d="M14 10 L14 14 L10 14 M14 6 L14 14 L6 14"
                                stroke="#8b949e"
                                strokeWidth="1.5"
                                fill="none"
                            />
                        </svg>
                    </div> */}

                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'sw')}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: 16,
                            height: 16,
                            cursor: 'sw-resize',
                            zIndex: 10,
                        }}
                    />

                    {/* <div
                        onMouseDown={(e) => handleResizeStart(e, 'ne')}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: 16,
                            height: 16,
                            cursor: 'ne-resize',
                            zIndex: 10,
                        }}
                    /> */}

                    {/* <div
                        onMouseDown={(e) => handleResizeStart(e, 'nw')}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 16,
                            height: 16,
                            cursor: 'nw-resize',
                            zIndex: 10,
                        }}
                    /> */}

                    {/* Edge handles */}
                    {/* <div
                        onMouseDown={(e) => handleResizeStart(e, 'n')}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 16,
                            right: 16,
                            height: 6,
                            cursor: 'n-resize',
                            zIndex: 10,
                        }}
                    /> */}

                    <div
                        onMouseDown={(e) => handleResizeStart(e, 's')}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 16,
                            right: 16,
                            height: 6,
                            cursor: 's-resize',
                            zIndex: 10,
                        }}
                    />

                    {/* <div
                        onMouseDown={(e) => handleResizeStart(e, 'e')}
                        style={{
                            position: 'absolute',
                            top: 16,
                            bottom: 16,
                            right: 0,
                            width: 6,
                            cursor: 'e-resize',
                            zIndex: 10,
                        }}
                    /> */}

                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'w')}
                        style={{
                            position: 'absolute',
                            top: 16,
                            bottom: 16,
                            left: 0,
                            width: 6,
                            cursor: 'w-resize',
                            zIndex: 10,
                        }}
                    />
                    </>
                )}
            </div>
        </>
    );
}
