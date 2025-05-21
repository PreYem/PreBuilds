<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $token;
    public $subjectLine;
    public $heading;
    public $messageBody;

    /**
     * Create a new message instance.
     */
    public function __construct($token, $subjectLine = 'Prebuilds Reset Code', $heading = 'Password Reset', $messageBody = 'Use the following code to reset your password:')
    {
        $this->token       = $token;
        $this->subjectLine = $subjectLine;
        $this->heading     = $heading;
        $this->messageBody = $messageBody;
    }

    public function build()
    {
        return $this->subject($this->subjectLine)
            ->html("
                <h1>{$this->heading}</h1>
                <p>{$this->messageBody}</p>
                <h2 style='color:#4f46e5;'>{$this->token}</h2>
                <p>If you did not request this, please ignore this email.</p>
                <a href='prebuilds.shop'>PreBuilds</a>
            ");
    }

    /**
     * Get the message envelope.
     */
    // public function envelope(): Envelope
    // {
    //     return new Envelope(
    //         subject: 'Reset Password Mail',
    //     );
    // }

    // /**
    //  * Get the message content definition.
    //  */
    // public function content(): Content
    // {
    //     return new Content(
    //         view: 'view.name',
    //     );
    // }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
