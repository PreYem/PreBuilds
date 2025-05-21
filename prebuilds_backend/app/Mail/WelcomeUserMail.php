<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeUserMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    use Queueable, SerializesModels;

    public $user_firstname;
    public $subjectLine;

    public function __construct(string $user_firstname)
    {
        $this->user_firstname = $user_firstname;
        $this->subjectLine    = 'Welcome to PreBuilds!';
    }

    public function build()
    {
        $userFirstnameEscaped = e($this->user_firstname);

        return $this->subject($this->subjectLine)
            ->html("
                <h1>Welcome, {$userFirstnameEscaped}!</h1>
                <p>We're excited to have you on board at <strong>PreBuilds</strong>.</p>
                <p>Explore our platform and discover custom PC builds tailored to your needs.</p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <a href='https://prebuilds.shop' style='color: #4f46e5;'>Visit PreBuilds</a>
                <br><br>
                <p>Thank you for joining us!</p>
            ");
    }
    /**
     * Get the message envelope.
     */
    // public function envelope(): Envelope
    // {
    //     return new Envelope(
    //         subject: 'Welcome User Mail',
    //     );
    // }

    /**
     * Get the message content definition.
     */
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
