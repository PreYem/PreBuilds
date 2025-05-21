<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order_status;
    public $order_id;
    public $user_firstname;
    public $type; // 'initiated' or 'status_update'
    public $order_totalAmount;
    public $subjectLine;

    public function __construct(
        string $order_status,
        string $order_id,
        string $user_firstname,
        string $type = 'status_update', // default type
        string $order_totalAmount = ''
    ) {
        $this->order_status      = $order_status;
        $this->order_id          = $order_id;
        $this->user_firstname    = $user_firstname;
        $this->type              = $type;
        $this->order_totalAmount = $order_totalAmount;

        // Set subject line based on type
        $this->subjectLine = $type === 'initiated'
        ? 'Your Order Has Been Initiated'
        : 'Your Order Status Has Updated';
    }

    public function build()
    {
        $userFirstnameEscaped     = e($this->user_firstname);
        $orderStatusEscaped       = e($this->order_status);
        $order_totalAmountEscaped = e($this->order_totalAmount);
        $orderIdEscaped           = e($this->order_id);

        // Different message body based on type
        $messageBody = $this->type === 'initiated'
        ? "Your order has been successfully initiated."
        : "Your order status has changed.";

        return $this->subject($this->subjectLine)
            ->html("
                <h1>Hello, {$userFirstnameEscaped}</h1>
                <p>{$messageBody} Order #{$orderIdEscaped}</p>
                <h2 style='color:#4f46e5;'>Status: {$orderStatusEscaped}</h2>
                <h2 style='color:#4f46e5;'>Total Amount: {$order_totalAmountEscaped}</h2>
                <p>If you weren't expecting this email, please contact support.</p>
                <a href='https://prebuilds.shop'>PreBuilds</a>
            ");
    }

    /**
     * Get the message envelope.
     */
    // public function envelope(): Envelope
    // {
    //     return new Envelope(
    //         subject: 'Order Status Mail',
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
